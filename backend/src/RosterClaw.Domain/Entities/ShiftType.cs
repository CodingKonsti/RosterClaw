namespace RosterClaw.Domain.Entities;

public class ShiftType
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}
