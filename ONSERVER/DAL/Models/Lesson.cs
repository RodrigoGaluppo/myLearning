using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Lesson
{
    public int Id { get; set; }

    public int? ChapterId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Accomplishedlesson> Accomplishedlessons { get; } = new List<Accomplishedlesson>();

    public virtual Chapter? Chapter { get; set; }

    public virtual ICollection<Resourcelesson> Resourcelessons { get; } = new List<Resourcelesson>();

    public virtual ICollection<Textlesson> Textlessons { get; } = new List<Textlesson>();

    public virtual ICollection<Videolesson> Videolessons { get; } = new List<Videolesson>();
}
