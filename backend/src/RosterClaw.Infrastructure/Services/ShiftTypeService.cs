using Microsoft.EntityFrameworkCore;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;
using RosterClaw.Domain.Entities;

namespace RosterClaw.Infrastructure.Services;

public class ShiftTypeService : IShiftTypeService
{
    private readonly IAppDbContext _db;
    public ShiftTypeService(IAppDbContext db) => _db = db;

    public async Task<IEnumerable<ShiftTypeDto>> GetAllAsync() =>
        await _db.ShiftTypes
            .Select(s => new ShiftTypeDto(s.Id, s.Name, s.StartTime, s.EndTime, s.Color))
            .ToListAsync();

    public async Task<ShiftTypeDto?> GetByIdAsync(Guid id)
    {
        var s = await _db.ShiftTypes.FindAsync(id);
        return s is null ? null : new ShiftTypeDto(s.Id, s.Name, s.StartTime, s.EndTime, s.Color);
    }

    public async Task<ShiftTypeDto> CreateAsync(CreateShiftTypeDto dto)
    {
        var s = new ShiftType { Name = dto.Name, StartTime = dto.StartTime, EndTime = dto.EndTime, Color = dto.Color };
        _db.ShiftTypes.Add(s);
        await _db.SaveChangesAsync();
        return new ShiftTypeDto(s.Id, s.Name, s.StartTime, s.EndTime, s.Color);
    }

    public async Task<ShiftTypeDto> UpdateAsync(Guid id, UpdateShiftTypeDto dto)
    {
        var s = await _db.ShiftTypes.FindAsync(id)
            ?? throw new KeyNotFoundException($"ShiftType {id} not found.");
        if (dto.Name is not null) s.Name = dto.Name;
        if (dto.StartTime is not null) s.StartTime = dto.StartTime;
        if (dto.EndTime is not null) s.EndTime = dto.EndTime;
        if (dto.Color is not null) s.Color = dto.Color;
        await _db.SaveChangesAsync();
        return new ShiftTypeDto(s.Id, s.Name, s.StartTime, s.EndTime, s.Color);
    }

    public async Task DeleteAsync(Guid id)
    {
        var s = await _db.ShiftTypes.FindAsync(id)
            ?? throw new KeyNotFoundException($"ShiftType {id} not found.");
        _db.ShiftTypes.Remove(s);
        await _db.SaveChangesAsync();
    }
}
