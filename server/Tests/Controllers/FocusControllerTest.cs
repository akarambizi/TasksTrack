using Xunit;
using Moq;
using TasksTrack.Controllers;
using TasksTrack.Services;
using TasksTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using System;

namespace TasksTrack.Tests.Controllers
{
    public class FocusControllerTest
    {
        private readonly Mock<IFocusSessionService> _mockService;
        private readonly Mock<ICurrentUserService> _mockCurrentUserService;
        private readonly FocusController _controller;
        private readonly string _testUserId = "test-user-123";

        public FocusControllerTest()
        {
            _mockService = new Mock<IFocusSessionService>();
            _mockCurrentUserService = new Mock<ICurrentUserService>();

            // Mock the GetUserId method to return test user ID
            _mockCurrentUserService.Setup(x => x.GetUserId()).Returns(_testUserId);

            _controller = new FocusController(_mockService.Object, _mockCurrentUserService.Object);

            // Mock the HttpContext and User claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, _testUserId)
            };
            var identity = new ClaimsIdentity(claims, "Test");
            var principal = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = principal
                }
            };
        }

        [Fact]
        public async Task StartSession_ValidRequest_ReturnsOkResult()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 1,
                PlannedDurationMinutes = 25
            };

            var expectedResponse = new FocusSessionResponse
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.UtcNow,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.UtcNow
            };

            _mockService.Setup(s => s.StartSessionAsync(request, _testUserId))
                       .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.StartSession(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<FocusSessionResponse>(okResult.Value);
            Assert.Equal(expectedResponse.Id, response.Id);
            Assert.Equal(expectedResponse.Status, response.Status);
        }

        [Fact]
        public async Task StartSession_ActiveSessionExists_ReturnsConflict()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 1,
                PlannedDurationMinutes = 25
            };

            _mockService.Setup(s => s.StartSessionAsync(request, _testUserId))
                       .ThrowsAsync(new InvalidOperationException("User already has an active focus session."));

            // Act
            var result = await _controller.StartSession(request);

            // Assert
            var conflictResult = Assert.IsType<ConflictObjectResult>(result.Result);
            var response = conflictResult.Value;
            Assert.NotNull(response);
            Assert.Contains("User already has an active focus session.", response.ToString());
        }

        [Fact]
        public async Task StartSession_InvalidHabit_ReturnsBadRequest()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 999,
                PlannedDurationMinutes = 25
            };

            _mockService.Setup(s => s.StartSessionAsync(request, _testUserId))
                       .ThrowsAsync(new ArgumentException("Habit not found."));

            // Act
            var result = await _controller.StartSession(request);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.NotNull(badRequestResult.Value);
            Assert.Contains("Habit not found.", badRequestResult.Value.ToString());
        }

        [Fact]
        public async Task PauseSession_ActiveSession_ReturnsOkResult()
        {
            // Arrange
            var expectedResponse = new FocusSessionResponse
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.UtcNow.AddMinutes(-10),
                PauseTime = DateTime.UtcNow,
                Status = "paused",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.UtcNow.AddMinutes(-10)
            };

            _mockService.Setup(s => s.PauseSessionAsync(_testUserId))
                       .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.PauseSession();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<FocusSessionResponse>(okResult.Value);
            Assert.Equal("paused", response.Status);
        }

        [Fact]
        public async Task PauseSession_NoActiveSession_ReturnsConflict()
        {
            // Arrange
            _mockService.Setup(s => s.PauseSessionAsync(_testUserId))
                       .ThrowsAsync(new InvalidOperationException("No active session found to pause."));

            // Act
            var result = await _controller.PauseSession();

            // Assert
            Assert.IsType<ConflictObjectResult>(result.Result);
        }

        [Fact]
        public async Task ResumeSession_PausedSession_ReturnsOkResult()
        {
            // Arrange
            var expectedResponse = new FocusSessionResponse
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.UtcNow.AddMinutes(-15),
                PauseTime = DateTime.UtcNow.AddMinutes(-5),
                ResumeTime = DateTime.UtcNow,
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.UtcNow.AddMinutes(-15)
            };

            _mockService.Setup(s => s.ResumeSessionAsync(_testUserId))
                       .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.ResumeSession();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<FocusSessionResponse>(okResult.Value);
            Assert.Equal("active", response.Status);
        }

        [Fact]
        public async Task CompleteSession_ActiveSession_ReturnsOkResult()
        {
            // Arrange
            var request = new FocusSessionCompleteRequest
            {
                Notes = "Great focus session!"
            };

            var expectedResponse = new FocusSessionResponse
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.UtcNow.AddMinutes(-25),
                EndTime = DateTime.UtcNow,
                Status = "completed",
                PlannedDurationMinutes = 25,
                ActualDurationSeconds = 1500, // 25 minutes
                Notes = "Great focus session!",
                CreatedDate = DateTime.UtcNow.AddMinutes(-25)
            };

            _mockService.Setup(s => s.CompleteSessionAsync(request, _testUserId))
                       .ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.CompleteSession(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<FocusSessionResponse>(okResult.Value);
            Assert.Equal("completed", response.Status);
            Assert.Equal("Great focus session!", response.Notes);
        }

        [Fact]
        public async Task GetSessions_ReturnsListOfSessions()
        {
            // Arrange
            var expectedSessions = new List<FocusSessionResponse>
            {
                new FocusSessionResponse
                {
                    Id = 1,
                    HabitId = 1,
                    CreatedBy = _testUserId,
                    StartTime = DateTime.UtcNow.AddDays(-1),
                    EndTime = DateTime.UtcNow.AddDays(-1).AddMinutes(25),
                    Status = "completed",
                    PlannedDurationMinutes = 25,
                    ActualDurationSeconds = 1500,
                    CreatedDate = DateTime.UtcNow.AddDays(-1)
                },
                new FocusSessionResponse
                {
                    Id = 2,
                    HabitId = 2,
                    CreatedBy = _testUserId,
                    StartTime = DateTime.UtcNow.AddHours(-1),
                    Status = "active",
                    PlannedDurationMinutes = 30,
                    CreatedDate = DateTime.UtcNow.AddHours(-1)
                }
            };

            _mockService.Setup(s => s.GetSessionsAsync(_testUserId))
                       .ReturnsAsync(expectedSessions);

            // Act
            var result = await _controller.GetSessions();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var sessions = Assert.IsAssignableFrom<IEnumerable<FocusSessionResponse>>(okResult.Value);
            Assert.Equal(2, sessions.Count());
        }

        [Fact]
        public async Task GetActiveSession_HasActiveSession_ReturnsOkResult()
        {
            // Arrange
            var expectedSession = new FocusSessionResponse
            {
                Id = 1,
                HabitId = 1,
                CreatedBy = _testUserId,
                StartTime = DateTime.UtcNow.AddMinutes(-10),
                Status = "active",
                PlannedDurationMinutes = 25,
                CreatedDate = DateTime.UtcNow.AddMinutes(-10)
            };

            _mockService.Setup(s => s.GetActiveSessionAsync(_testUserId))
                       .ReturnsAsync(expectedSession);

            // Act
            var result = await _controller.GetActiveSession();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var session = Assert.IsType<FocusSessionResponse>(okResult.Value);
            Assert.Equal("active", session.Status);
        }

        [Fact]
        public async Task GetActiveSession_NoActiveSession_ReturnsNoContent()
        {
            // Arrange
            _mockService.Setup(s => s.GetActiveSessionAsync(_testUserId))
                       .ReturnsAsync((FocusSessionResponse?)null);

            // Act
            var result = await _controller.GetActiveSession();

            // Assert
            Assert.IsType<NoContentResult>(result.Result);
        }

        [Fact]
        public async Task GetAnalytics_ValidDateRange_ReturnsAnalytics()
        {
            // Arrange
            var startDate = DateTime.UtcNow.AddDays(-7);
            var endDate = DateTime.UtcNow;
            var expectedAnalytics = new FocusSessionAnalytics
            {
                TotalSessions = 5,
                TotalMinutes = 125,
                AverageSessionMinutes = 25.0,
                CompletedSessions = 4,
                CompletionRate = 0.8
            };

            _mockService.Setup(s => s.GetAnalyticsAsync(_testUserId, startDate, endDate))
                       .ReturnsAsync(expectedAnalytics);

            // Act
            var result = await _controller.GetAnalytics(startDate, endDate);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var analytics = Assert.IsType<FocusSessionAnalytics>(okResult.Value);
            Assert.Equal(5, analytics.TotalSessions);
            Assert.Equal(125, analytics.TotalMinutes);
            Assert.Equal(0.8, analytics.CompletionRate);
        }

        [Fact]
        public async Task GetAnalytics_NoDateRange_ReturnsAnalytics()
        {
            // Arrange
            var expectedAnalytics = new FocusSessionAnalytics
            {
                TotalSessions = 10,
                TotalMinutes = 250,
                AverageSessionMinutes = 25.0,
                CompletedSessions = 8,
                CompletionRate = 0.8
            };

            _mockService.Setup(s => s.GetAnalyticsAsync(_testUserId, null, null))
                       .ReturnsAsync(expectedAnalytics);

            // Act
            var result = await _controller.GetAnalytics(null, null);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var analytics = Assert.IsType<FocusSessionAnalytics>(okResult.Value);
            Assert.Equal(10, analytics.TotalSessions);
        }

        [Fact]
        public async Task StartSession_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            var request = new FocusSessionStartRequest
            {
                HabitId = 1,
                PlannedDurationMinutes = 25
            };

            _mockService.Setup(s => s.StartSessionAsync(request, _testUserId))
                       .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.StartSession(request);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task PauseSession_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            _mockService.Setup(s => s.PauseSessionAsync(_testUserId))
                       .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.PauseSession();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task ResumeSession_NoSessionToPause_ReturnsConflict()
        {
            // Arrange
            _mockService.Setup(s => s.ResumeSessionAsync(_testUserId))
                       .ThrowsAsync(new InvalidOperationException("No paused session found to resume."));

            // Act
            var result = await _controller.ResumeSession();

            // Assert
            Assert.IsType<ConflictObjectResult>(result.Result);
        }

        [Fact]
        public async Task ResumeSession_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            _mockService.Setup(s => s.ResumeSessionAsync(_testUserId))
                       .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.ResumeSession();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task CompleteSession_NoActiveSession_ReturnsConflict()
        {
            // Arrange
            var request = new FocusSessionCompleteRequest
            {
                Notes = "Test notes"
            };

            _mockService.Setup(s => s.CompleteSessionAsync(request, _testUserId))
                       .ThrowsAsync(new InvalidOperationException("No active session found to complete."));

            // Act
            var result = await _controller.CompleteSession(request);

            // Assert
            Assert.IsType<ConflictObjectResult>(result.Result);
        }

        [Fact]
        public async Task CompleteSession_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            var request = new FocusSessionCompleteRequest
            {
                Notes = "Test notes"
            };

            _mockService.Setup(s => s.CompleteSessionAsync(request, _testUserId))
                       .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.CompleteSession(request);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task GetSessions_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            _mockService.Setup(s => s.GetSessionsAsync(_testUserId))
                       .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.GetSessions();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task GetActiveSession_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            _mockService.Setup(s => s.GetActiveSessionAsync(_testUserId))
                       .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.GetActiveSession();

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }

        [Fact]
        public async Task GetAnalytics_ServiceThrowsException_ReturnsInternalServerError()
        {
            // Arrange
            _mockService.Setup(s => s.GetAnalyticsAsync(_testUserId, null, null))
                       .ThrowsAsync(new Exception("Unexpected error"));

            // Act
            var result = await _controller.GetAnalytics(null, null);

            // Assert
            var statusResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusResult.StatusCode);
        }
    }
}