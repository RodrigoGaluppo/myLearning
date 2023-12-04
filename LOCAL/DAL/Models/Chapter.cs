using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Chapter
{
    public int Id { get; set; }

    public int? CourseId { get; set; }

    public string? Title { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Course? Course { get; set; }

    public virtual ICollection<Lesson> Lessons { get; } = new List<Lesson>();
}
