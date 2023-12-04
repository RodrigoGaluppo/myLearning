namespace DAL.Controllers.Request;

public class LessonCreateRequest {

    public int? ChapterId { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }
}