using RosterClaw.Application.DTOs;

namespace RosterClaw.Application.Common.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(string id);
    Task<UserDto> UpdateUserAsync(string id, UpdateUserDto dto);
    Task DeleteUserAsync(string id);
}
