using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Question
{
    public int Id { get; set; }

    public Guid? CustomerId { get; set; }

    public int? CourseId { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Comment> Comments { get; } = new List<Comment>();

    public virtual Course? Course { get; set; }

    public virtual Customer? Customer { get; set; }
}
