namespace RosterClaw.Application.DTOs;

public record UserDto(
    string Id,
    string? Email,
    string FirstName,
    string LastName,
    string Role,
    DateTime CreatedAt
);

public record UpdateUserDto(string? FirstName, string? LastName, string? Email);
