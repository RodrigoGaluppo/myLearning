namespace DAL.Controllers.Request;

public class ReviewCreateRequest {
     public Guid CustomerId { get; set; }

    public int CourseId { get; set; }

    public int? Rating { get; set; }

    public string? Content { get; set; }

}