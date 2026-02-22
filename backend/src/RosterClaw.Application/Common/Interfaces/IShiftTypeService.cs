using RosterClaw.Application.DTOs;

namespace RosterClaw.Application.Common.Interfaces;

public interface IShiftTypeService
{
    Task<IEnumerable<ShiftTypeDto>> GetAllAsync();
    Task<ShiftTypeDto?> GetByIdAsync(Guid id);
    Task<ShiftTypeDto> CreateAsync(CreateShiftTypeDto dto);
    Task<ShiftTypeDto> UpdateAsync(Guid id, UpdateShiftTypeDto dto);
    Task DeleteAsync(Guid id);
}
