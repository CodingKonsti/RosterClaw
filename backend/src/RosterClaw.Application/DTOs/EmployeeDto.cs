namespace RosterClaw.Application.DTOs;

public record EmployeeDto(Guid Id, string FirstName, string LastName, string JobRole, string Email, string Phone, DateTime CreatedAt);
public record CreateEmployeeDto(string FirstName, string LastName, string JobRole, string Email, string Phone);
public record UpdateEmployeeDto(string? FirstName, string? LastName, string? JobRole, string? Email, string? Phone);
