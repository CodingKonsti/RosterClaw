namespace RosterClaw.Domain.Entities;

public class ShiftAssignment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid EmployeeId { get; set; }
    public Employee Employee { get; set; } = null!;
    public Guid ShiftTypeId { get; set; }
    public ShiftType ShiftType { get; set; } = null!;
    public DateOnly Date { get; set; }
}
