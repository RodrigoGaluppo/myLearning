namespace DAL.Controllers.Request;

public class TextLessonCreateRequest {

   
    public int? LessonId { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

}