namespace DAL.Controllers.Request;

public class CustomerCourseCreateRequest {

    public Guid? CustomerId { get; set; }

    public int? CourseId { get; set; }
}