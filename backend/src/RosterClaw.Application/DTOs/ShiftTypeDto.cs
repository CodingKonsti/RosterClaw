namespace RosterClaw.Application.DTOs;

public record ShiftTypeDto(Guid Id, string Name, string StartTime, string EndTime, string Color);
public record CreateShiftTypeDto(string Name, string StartTime, string EndTime, string Color);
public record UpdateShiftTypeDto(string? Name, string? StartTime, string? EndTime, string? Color);
