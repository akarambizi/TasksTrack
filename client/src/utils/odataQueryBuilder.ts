import { formatDateForOData } from './odataHelpers';

/**
 * OData query options interface
 */
export interface IODataQueryOptions {
  $filter?: string | string[];
  $orderby?: string | string[];
  $top?: number;
  $skip?: number;
  $select?: string[];
  $expand?: string[];
  $count?: boolean;
}

/**
 * Filter condition interface for building complex filters
 */
export interface IFilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le' | 'contains' | 'startswith' | 'endswith';
  value: string | number | boolean | Date;
}

/**
 * Date range filter interface
 */
export interface IDateRangeFilter {
  field: string;
  startDate?: string | Date;
  endDate?: string | Date;
}

/**
 * OData Query Builder - Fluent API for building OData query strings
 *
 * @example
 * ```typescript
 * const query = new ODataQueryBuilder()
 *   .filter("contains(name,'john')")
 *   .orderBy('name desc')
 *   .top(10)
 *   .build();
 * ```
 */
export class ODataQueryBuilder {
  private options: IODataQueryOptions = {};

  /**
   * Add a filter condition
   */
  filter(filter: string | string[]): this {
    // Skip empty/falsy filters
    if (!filter || (Array.isArray(filter) && filter.length === 0)) {
      return this;
    }

    if (Array.isArray(filter)) {
      const validFilters = filter.filter(f => f && f.trim());
      if (validFilters.length === 0) return this;

      this.options.$filter = this.options.$filter
        ? [...(Array.isArray(this.options.$filter) ? this.options.$filter : [this.options.$filter]), ...validFilters]
        : validFilters;
    } else {
      if (!filter.trim()) return this;

      this.options.$filter = this.options.$filter
        ? [...(Array.isArray(this.options.$filter) ? this.options.$filter : [this.options.$filter]), filter]
        : [filter];
    }
    return this;
  }

  /**
   * Add date range filter (handles timezone conversion automatically)
   */
  dateRangeFilter(config: IDateRangeFilter): this {
    const conditions: string[] = [];

    if (config.startDate) {
      const formattedStart = formatDateForOData(config.startDate, 'start');
      conditions.push(`${config.field} ge ${new Date(formattedStart).toISOString()}`);
    }

    if (config.endDate) {
      const formattedEnd = formatDateForOData(config.endDate, 'end');
      conditions.push(`${config.field} le ${new Date(formattedEnd).toISOString()}`);
    }

    if (conditions.length > 0) {
      return this.filter(conditions);
    }

    return this;
  }

  /**
   * Add multiple filter conditions with automatic operator handling
   */
  filterConditions(conditions: IFilterCondition[], combineWith: 'and' | 'or' = 'and'): this {
    const filterStrings = conditions.map(condition => {
      switch (condition.operator) {
        case 'eq':
          return `${condition.field} eq '${condition.value}'`;
        case 'ne':
          return `${condition.field} ne '${condition.value}'`;
        case 'gt':
          return `${condition.field} gt ${condition.value}`;
        case 'ge':
          return `${condition.field} ge ${condition.value}`;
        case 'lt':
          return `${condition.field} lt ${condition.value}`;
        case 'le':
          return `${condition.field} le ${condition.value}`;
        case 'contains':
          return `contains(${condition.field},'${condition.value}')`;
        case 'startswith':
          return `startswith(${condition.field},'${condition.value}')`;
        case 'endswith':
          return `endswith(${condition.field},'${condition.value}')`;
        default:
          throw new Error(`Unsupported operator: ${condition.operator}`);
      }
    });

    if (filterStrings.length > 0) {
      const combinedFilter = filterStrings.join(` ${combineWith} `);
      return this.filter(combinedFilter);
    }

    return this;
  }

  /**
   * Set order by clause
   */
  orderBy(orderBy: string | string[]): this {
    this.options.$orderby = orderBy;
    return this;
  }

  /**
   * Set top (limit) clause
   */
  top(count: number): this {
    if (count > 0) {
      this.options.$top = count;
    }
    return this;
  }

  /**
   * Set skip (offset) clause
   */
  skip(count: number): this {
    this.options.$skip = count;
    return this;
  }

  /**
   * Set pagination (convenience method)
   */
  paginate(page: number, pageSize: number): this {
    this.top(pageSize);
    this.skip((page - 1) * pageSize);
    return this;
  }

  /**
   * Set select clause (fields to return)
   */
  select(fields: string[]): this {
    this.options.$select = fields;
    return this;
  }

  /**
   * Set expand clause (related entities)
   */
  expand(relations: string[]): this {
    this.options.$expand = relations;
    return this;
  }

  /**
   * Enable count
   */
  count(enable: boolean = true): this {
    this.options.$count = enable;
    return this;
  }

  /**
   * Build the final query string
   */
  build(): string {
    const params: string[] = [];

    // Handle filters
    if (this.options.$filter) {
      const filter = Array.isArray(this.options.$filter)
        ? this.options.$filter.join(' and ')
        : this.options.$filter;
      params.push(`$filter=${encodeURIComponent(filter)}`);
    }

    // Handle order by
    if (this.options.$orderby) {
      const orderBy = Array.isArray(this.options.$orderby)
        ? this.options.$orderby.join(',')
        : this.options.$orderby;
      params.push(`$orderby=${encodeURIComponent(orderBy)}`);
    }

    // Handle pagination
    if (typeof this.options.$top === 'number') {
      params.push(`$top=${this.options.$top}`);
    }

    if (typeof this.options.$skip === 'number') {
      params.push(`$skip=${this.options.$skip}`);
    }

    // Handle select
    if (this.options.$select?.length) {
      params.push(`$select=${encodeURIComponent(this.options.$select.join(','))}`);
    }

    // Handle expand
    if (this.options.$expand?.length) {
      params.push(`$expand=${encodeURIComponent(this.options.$expand.join(','))}`);
    }

    // Handle count
    if (this.options.$count) {
      params.push('$count=true');
    }

    return params.length > 0 ? `?${params.join('&')}` : '';
  }

  /**
   * Reset the builder to start fresh
   */
  reset(): this {
    this.options = {};
    return this;
  }
}
