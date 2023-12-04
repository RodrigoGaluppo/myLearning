namespace DAL.Controllers.Request;

public class CommentCreateRequest {

    public int? QuestionId { get; set; }

    public Guid? CustomerId { get; set; }

    public string? Content { get; set; }
}