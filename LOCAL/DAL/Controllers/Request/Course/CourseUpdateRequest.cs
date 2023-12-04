namespace DAL.Controllers.Request;

public class CourseCreateRequest {

   public int? SubjectId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public int? Price { get; set; }

}