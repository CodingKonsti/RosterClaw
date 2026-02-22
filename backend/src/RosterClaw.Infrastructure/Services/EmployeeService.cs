using Microsoft.EntityFrameworkCore;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Application.DTOs;
using RosterClaw.Domain.Entities;

namespace RosterClaw.Infrastructure.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IAppDbContext _db;
    public EmployeeService(IAppDbContext db) => _db = db;

    public async Task<IEnumerable<EmployeeDto>> GetAllAsync() =>
        await _db.Employees
            .Select(e => new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobRole, e.Email, e.Phone, e.CreatedAt))
            .ToListAsync();

    public async Task<EmployeeDto?> GetByIdAsync(Guid id)
    {
        var e = await _db.Employees.FindAsync(id);
        return e is null ? null : new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobRole, e.Email, e.Phone, e.CreatedAt);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var e = new Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            JobRole = dto.JobRole,
            Email = dto.Email,
            Phone = dto.Phone
        };
        _db.Employees.Add(e);
        await _db.SaveChangesAsync();
        return new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobRole, e.Email, e.Phone, e.CreatedAt);
    }

    public async Task<EmployeeDto> UpdateAsync(Guid id, UpdateEmployeeDto dto)
    {
        var e = await _db.Employees.FindAsync(id)
            ?? throw new KeyNotFoundException($"Employee {id} not found.");
        if (dto.FirstName is not null) e.FirstName = dto.FirstName;
        if (dto.LastName is not null) e.LastName = dto.LastName;
        if (dto.JobRole is not null) e.JobRole = dto.JobRole;
        if (dto.Email is not null) e.Email = dto.Email;
        if (dto.Phone is not null) e.Phone = dto.Phone;
        await _db.SaveChangesAsync();
        return new EmployeeDto(e.Id, e.FirstName, e.LastName, e.JobRole, e.Email, e.Phone, e.CreatedAt);
    }

    public async Task DeleteAsync(Guid id)
    {
        var e = await _db.Employees.FindAsync(id)
            ?? throw new KeyNotFoundException($"Employee {id} not found.");
        _db.Employees.Remove(e);
        await _db.SaveChangesAsync();
    }
}
