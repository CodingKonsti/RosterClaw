namespace RosterClaw.Application.DTOs;

public record ShiftAssignmentDto(Guid Id, Guid EmployeeId, Guid ShiftTypeId, string Date);
public record CreateShiftAssignmentDto(Guid EmployeeId, Guid ShiftTypeId, string Date);
