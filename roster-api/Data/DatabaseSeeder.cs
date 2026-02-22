using Microsoft.AspNetCore.Identity;
using RosterClaw.Api.Models;

namespace RosterClaw.Api.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        string[] roles = ["Admin", "Manager", "Employee"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // Admin
        if (await userManager.FindByEmailAsync("admin@rosterclaw.com") is null)
        {
            var admin = new ApplicationUser
            {
                UserName = "admin@rosterclaw.com",
                Email = "admin@rosterclaw.com",
                FirstName = "System",
                LastName = "Admin",
                Role = "Admin",
                EmailConfirmed = true
            };
            await userManager.CreateAsync(admin, "Admin123!");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Managers
        var managers = new[]
        {
            ("sarah.johnson@rosterclaw.com", "Sarah", "Johnson"),
            ("michael.chen@rosterclaw.com", "Michael", "Chen")
        };
        foreach (var (email, first, last) in managers)
        {
            if (await userManager.FindByEmailAsync(email) is null)
            {
                var mgr = new ApplicationUser
                {
                    UserName = email, Email = email,
                    FirstName = first, LastName = last,
                    Role = "Manager", EmailConfirmed = true
                };
                await userManager.CreateAsync(mgr, "Manager123!");
                await userManager.AddToRoleAsync(mgr, "Manager");
            }
        }

        // 50 Employees
        var firstNames = new[] { "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "David", "Linda", "William", "Elizabeth", "Richard", "Barbara", "Joseph", "Susan", "Thomas", "Jessica", "Christopher", "Sarah", "Charles", "Karen", "Daniel", "Lisa", "Matthew", "Nancy", "Anthony", "Betty", "Mark", "Margaret", "Donald", "Sandra", "Steven", "Ashley", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle", "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Timothy", "Deborah", "Ronald", "Stephanie" };
        var lastNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts" };

        for (int i = 0; i < 50; i++)
        {
            var email = $"{firstNames[i].ToLower()}.{lastNames[i].ToLower()}@rosterclaw.com";
            if (await userManager.FindByEmailAsync(email) is null)
            {
                var emp = new ApplicationUser
                {
                    UserName = email, Email = email,
                    FirstName = firstNames[i], LastName = lastNames[i],
                    Role = "Employee", EmailConfirmed = true
                };
                await userManager.CreateAsync(emp, "Employee123!");
                await userManager.AddToRoleAsync(emp, "Employee");
            }
        }
    }
}
