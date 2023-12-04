using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Resourcelesson
{
    public int Id { get; set; }

    public int? LessonId { get; set; }

    public string? Title { get; set; }

    public string? Link { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Lesson? Lesson { get; set; }
}
