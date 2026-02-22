using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RosterClaw.Application.Common.Interfaces;
using RosterClaw.Domain.Entities;
using RosterClaw.Infrastructure.Identity;

namespace RosterClaw.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<ShiftType> ShiftTypes => Set<ShiftType>();
    public DbSet<ShiftAssignment> ShiftAssignments => Set<ShiftAssignment>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ShiftAssignment>()
            .HasOne(a => a.Employee)
            .WithMany()
            .HasForeignKey(a => a.EmployeeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ShiftAssignment>()
            .HasOne(a => a.ShiftType)
            .WithMany()
            .HasForeignKey(a => a.ShiftTypeId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
