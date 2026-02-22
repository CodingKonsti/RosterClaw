using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;
using RosterClaw.Infrastructure.Identity;

namespace RosterClaw.Infrastructure.Services;

public class RoleService : IRoleService
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public RoleService(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    public IEnumerable<RoleDto> GetAllRoles()
        => _roleManager.Roles.Select(r => new RoleDto(r.Id, r.Name)).ToList();

    public async Task AssignRoleAsync(AssignRoleDto dto)
    {
        var user = await _userManager.FindByIdAsync(dto.UserId)
            ?? throw new KeyNotFoundException($"User {dto.UserId} not found.");

        if (!await _roleManager.RoleExistsAsync(dto.Role))
            throw new ArgumentException($"Role '{dto.Role}' does not exist.");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, dto.Role);

        user.Role = dto.Role;
        await _userManager.UpdateAsync(user);
    }
}
