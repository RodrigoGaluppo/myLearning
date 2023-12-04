using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Comment
{
    public int Id { get; set; }

    public int? QuestionId { get; set; }

    public Guid? CustomerId { get; set; }

    public string? Content { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Customer? Customer { get; set; }

    public virtual Question? Question { get; set; }
}
