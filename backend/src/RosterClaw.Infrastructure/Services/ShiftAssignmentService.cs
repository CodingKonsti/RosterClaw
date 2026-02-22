using Microsoft.EntityFrameworkCore;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;
using RosterClaw.Domain.Entities;

namespace RosterClaw.Infrastructure.Services;

public class ShiftAssignmentService : IShiftAssignmentService
{
    private readonly IAppDbContext _db;
    public ShiftAssignmentService(IAppDbContext db) => _db = db;

    public async Task<IEnumerable<ShiftAssignmentDto>> GetAllAsync() =>
        await _db.ShiftAssignments
            .Select(a => new ShiftAssignmentDto(a.Id, a.EmployeeId, a.ShiftTypeId, a.Date.ToString("yyyy-MM-dd")))
            .ToListAsync();

    public async Task<IEnumerable<ShiftAssignmentDto>> GetByDateAsync(string date)
    {
        var d = DateOnly.Parse(date);
        return await _db.ShiftAssignments
            .Where(a => a.Date == d)
            .Select(a => new ShiftAssignmentDto(a.Id, a.EmployeeId, a.ShiftTypeId, a.Date.ToString("yyyy-MM-dd")))
            .ToListAsync();
    }

    public async Task<ShiftAssignmentDto> CreateAsync(CreateShiftAssignmentDto dto)
    {
        var a = new ShiftAssignment
        {
            EmployeeId = dto.EmployeeId,
            ShiftTypeId = dto.ShiftTypeId,
            Date = DateOnly.Parse(dto.Date)
        };
        _db.ShiftAssignments.Add(a);
        await _db.SaveChangesAsync();
        return new ShiftAssignmentDto(a.Id, a.EmployeeId, a.ShiftTypeId, a.Date.ToString("yyyy-MM-dd"));
    }

    public async Task DeleteAsync(Guid id)
    {
        var a = await _db.ShiftAssignments.FindAsync(id)
            ?? throw new KeyNotFoundException($"ShiftAssignment {id} not found.");
        _db.ShiftAssignments.Remove(a);
        await _db.SaveChangesAsync();
    }
}
