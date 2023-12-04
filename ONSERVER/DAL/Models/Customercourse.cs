using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Customercourse
{
    public int Id { get; set; }

    public Guid? CustomerId { get; set; }

    public int? CourseId { get; set; }


    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Certificate? Certificate { get; set; }

    public virtual Course? Course { get; set; }

    public virtual Customer? Customer { get; set; }
}
