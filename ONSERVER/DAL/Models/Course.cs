using System;
using System.Collections.Generic;

namespace DAL.Models;

public partial class Course
{
    public int Id { get; set; }

    public int? SubjectId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int? Price { get; set; }

    public bool? Active { get; set; }

    public string? ImgUrl { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Chapter> Chapters { get; } = new List<Chapter>();

    public virtual ICollection<Customercourse> Customercourses { get; } = new List<Customercourse>();

    public virtual ICollection<Question> Questions { get; } = new List<Question>();


    public virtual Subject? Subject { get; set; }
}
