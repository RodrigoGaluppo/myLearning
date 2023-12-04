using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Certificate
{
    public int CustomercourseId { get; set; }

    public string? Url { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Customercourse Customercourse { get; set; } = null!;
}
