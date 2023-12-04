using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Employee
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public char? Gender { get; set; }

    public DateOnly? BirthDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual String? EmployeeRole { get; set; }

}
