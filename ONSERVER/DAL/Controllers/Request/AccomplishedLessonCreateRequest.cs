namespace DAL.Controllers.Request;

public class AccomplishedLessonCreateRequest {
    public int LessonId { get; set; }

    public Guid CustomerId { get; set; }
}