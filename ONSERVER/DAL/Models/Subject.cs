using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Subject
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Course> Courses { get; } = new List<Course>();
}
