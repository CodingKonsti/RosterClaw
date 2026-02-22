using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;
using RosterClaw.Infrastructure.Identity;

namespace RosterClaw.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UserService(UserManager<ApplicationUser> userManager)
        => _userManager = userManager;

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        => await _userManager.Users
            .Select(u => new UserDto(u.Id, u.Email, u.FirstName, u.LastName, u.Role, u.CreatedAt))
            .ToListAsync();

    public async Task<UserDto?> GetUserByIdAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        return user is null
            ? null
            : new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.CreatedAt);
    }

    public async Task<UserDto> UpdateUserAsync(string id, UpdateUserDto dto)
    {
        var user = await _userManager.FindByIdAsync(id)
            ?? throw new KeyNotFoundException($"User {id} not found.");

        user.FirstName = dto.FirstName ?? user.FirstName;
        user.LastName = dto.LastName ?? user.LastName;
        if (dto.Email is not null)
        {
            user.Email = dto.Email;
            user.UserName = dto.Email;
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));

        return new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.CreatedAt);
    }

    public async Task DeleteUserAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id)
            ?? throw new KeyNotFoundException($"User {id} not found.");

        var result = await _userManager.DeleteAsync(user);
        if (!result.Succeeded)
            throw new InvalidOperationException(string.Join(", ", result.Errors.Select(e => e.Description)));
    }
}
