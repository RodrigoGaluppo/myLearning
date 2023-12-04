namespace DAL.Controllers.Request;

public class QuestionCreateRequest {
     public Guid CustomerId { get; set; }

    public int CourseId { get; set; }

    public string? Title  { get; set; }

    public string? Content { get; set; }

}