using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;

namespace RosterClaw.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "Admin")]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService) => _roleService = roleService;

    [HttpGet]
    public IActionResult GetRoles() => Ok(_roleService.GetAllRoles());

    [HttpPost("assign")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto dto)
    {
        try
        {
            await _roleService.AssignRoleAsync(dto);
            return Ok(new { message = $"Role '{dto.Role}' assigned." });
        }
        catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
        catch (ArgumentException ex) { return BadRequest(ex.Message); }
    }
}
