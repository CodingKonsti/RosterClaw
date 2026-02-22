using Microsoft.EntityFrameworkCore;
using RosterClaw.Domain.Entities;

namespace RosterClaw.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Employee> Employees { get; }
    DbSet<ShiftType> ShiftTypes { get; }
    DbSet<ShiftAssignment> ShiftAssignments { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
