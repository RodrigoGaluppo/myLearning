using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Customer
{
    public Guid Id { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public char? Gender { get; set; }

    public DateOnly? BirthDate { get; set; }

    public bool? Active { get; set; }

    public bool? IsConfirmed { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? ImgUrl { get; set; }

    public virtual ICollection<Accomplishedlesson> Accomplishedlessons { get; } = new List<Accomplishedlesson>();

    public virtual ICollection<Comment> Comments { get; } = new List<Comment>();

    public virtual ICollection<Customercourse> Customercourses { get; } = new List<Customercourse>();

    public virtual ICollection<Question> Questions { get; } = new List<Question>();


}
