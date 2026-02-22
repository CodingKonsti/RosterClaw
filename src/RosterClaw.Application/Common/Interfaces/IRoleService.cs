using RosterClaw.Application.DTOs;

namespace RosterClaw.Application.Common.Interfaces;

public interface IRoleService
{
    IEnumerable<RoleDto> GetAllRoles();
    Task AssignRoleAsync(AssignRoleDto dto);
}
