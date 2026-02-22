using Microsoft.EntityFrameworkCore;

namespace RosterClaw.Application.Common.Interfaces;

public interface IAppDbContext
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
