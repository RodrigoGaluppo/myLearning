namespace DAL.Controllers.Request;

public class HistoryCreateRequest {
    
    public int? LessonId { get; set; }

    public Guid? CustomerId { get; set; }
}