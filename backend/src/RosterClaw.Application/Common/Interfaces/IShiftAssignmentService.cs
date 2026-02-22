using RosterClaw.Application.DTOs;

namespace RosterClaw.Application.Common.Interfaces;

public interface IShiftAssignmentService
{
    Task<IEnumerable<ShiftAssignmentDto>> GetAllAsync();
    Task<IEnumerable<ShiftAssignmentDto>> GetByDateAsync(string date);
    Task<ShiftAssignmentDto> CreateAsync(CreateShiftAssignmentDto dto);
    Task DeleteAsync(Guid id);
}
