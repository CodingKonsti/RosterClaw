using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RosterClaw.Api.Models;

namespace RosterClaw.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _userManager.Users.Select(u => new
        {
            u.Id, u.Email, u.FirstName, u.LastName, u.Role, u.CreatedAt
        }).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();
        return Ok(new { user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.CreatedAt });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserRequest request)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();

        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;
        user.Email = request.Email ?? user.Email;
        user.UserName = request.Email ?? user.UserName;

        await _userManager.UpdateAsync(user);
        return Ok(new { user.Id, user.Email, user.FirstName, user.LastName, user.Role, user.CreatedAt });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return NotFound();
        await _userManager.DeleteAsync(user);
        return NoContent();
    }
}

public record UpdateUserRequest(string? FirstName, string? LastName, string? Email);
