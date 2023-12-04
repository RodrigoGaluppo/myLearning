using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Accomplishedlesson
{
    public int LessonId { get; set; }

    public Guid CustomerId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Customer Customer { get; set; } = null!;

    public virtual Lesson Lesson { get; set; } = null!;
}
