using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RosterClaw.Api.Models;

namespace RosterClaw.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class RolesController : ControllerBase
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly UserManager<ApplicationUser> _userManager;

    public RolesController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult GetRoles() =>
        Ok(_roleManager.Roles.Select(r => new { r.Id, r.Name }).ToList());

    [HttpPost("assign")]
    public async Task<IActionResult> AssignRole([FromBody] AssignRoleRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user is null) return NotFound("User not found");

        if (!await _roleManager.RoleExistsAsync(request.Role))
            return BadRequest("Role does not exist");

        var currentRoles = await _userManager.GetRolesAsync(user);
        await _userManager.RemoveFromRolesAsync(user, currentRoles);
        await _userManager.AddToRoleAsync(user, request.Role);
        user.Role = request.Role;
        await _userManager.UpdateAsync(user);

        return Ok(new { message = $"Role '{request.Role}' assigned to user." });
    }
}

public record AssignRoleRequest(string UserId, string Role);
