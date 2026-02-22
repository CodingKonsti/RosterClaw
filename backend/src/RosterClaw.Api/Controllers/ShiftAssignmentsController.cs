using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;

namespace RosterClaw.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ShiftAssignmentsController : ControllerBase
{
    private readonly IShiftAssignmentService _service;
    public ShiftAssignmentsController(IShiftAssignmentService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("by-date/{date}")]
    public async Task<IActionResult> GetByDate(string date)
        => Ok(await _service.GetByDateAsync(date));

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateShiftAssignmentDto dto)
        => Ok(await _service.CreateAsync(dto));

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    }
}
