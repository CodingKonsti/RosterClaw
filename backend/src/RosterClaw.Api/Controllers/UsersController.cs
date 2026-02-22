using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;

namespace RosterClaw.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService) => _userService = userService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _userService.GetAllUsersAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateUserDto dto)
    {
        try
        {
            return Ok(await _userService.UpdateUserAsync(id, dto));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        try
        {
            await _userService.DeleteUserAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
}
