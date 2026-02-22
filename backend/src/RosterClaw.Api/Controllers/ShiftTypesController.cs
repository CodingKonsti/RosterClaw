using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;

namespace RosterClaw.Api.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ShiftTypesController : ControllerBase
{
    private readonly IShiftTypeService _service;
    public ShiftTypesController(IShiftTypeService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateShiftTypeDto dto)
        => Ok(await _service.CreateAsync(dto));

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateShiftTypeDto dto)
    {
        try { return Ok(await _service.UpdateAsync(id, dto)); }
        catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try { await _service.DeleteAsync(id); return NoContent(); }
        catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
    }
}
