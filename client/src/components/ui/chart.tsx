import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '@/lib/utils';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke="#ccc"]]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke="#fff"]]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-border [&_.recharts-sector[stroke="#fff"]]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none',
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig
  .map(([key, cfg]) => `  --color-${key}: ${cfg.color};`)
  .join('\n')}
}
`,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

interface IChartTooltipPayloadItem {
  dataKey?: string;
  name?: string;
  value?: string | number;
  color?: string;
  payload: Record<string, unknown>;
}

interface IChartTooltipContentProps {
  active?: boolean;
  payload?: IChartTooltipPayloadItem[];
  className?: string;
  indicator?: 'line' | 'dot';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  label?: React.ReactNode;
  labelFormatter?: (label: React.ReactNode, payload: IChartTooltipPayloadItem[]) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: string | number | undefined,
    name: string | undefined,
    item: IChartTooltipPayloadItem,
    index: number,
    payload: Record<string, unknown>
  ) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  IChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) {
      return null;
    }

    const tooltipLabel = !hideLabel
      ? labelFormatter
        ? labelFormatter(label, payload)
        : label
      : null;

    return (
      <div
        ref={ref}
        className={cn(
          'grid min-w-[180px] items-start gap-2 rounded-lg border bg-background px-3 py-2 text-xs shadow-xl',
          className
        )}
      >
        {tooltipLabel && (
          <div className={cn('font-medium', labelClassName)}>{tooltipLabel}</div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item: IChartTooltipPayloadItem, index: number) => {
            const key = `${nameKey || item.dataKey || item.name || 'value'}`;
            const itemConfig = config[key] || config[item.name as string];
            const indicatorColor = color || (item.payload as { fill?: string }).fill || item.color;

            return (
              <div key={index} className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {!hideIndicator && (
                    <span
                      className={cn(
                        'shrink-0 rounded-[2px]',
                        indicator === 'dot' ? 'h-2 w-2 rounded-full' : 'h-0.5 w-3'
                      )}
                      style={{ backgroundColor: indicatorColor }}
                    />
                  )}
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name || labelKey || 'value'}
                  </span>
                </div>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatter
                    ? formatter(item.value, item.name, item, index, item.payload)
                    : item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltipContent';

export { ChartContainer, ChartTooltip, ChartTooltipContent };
