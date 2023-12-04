namespace DAL.Controllers.Request;

public class EmployeeCreateRequest {

    public string? EmployeeRole { get; set; }

    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? Password { get; set; }

    public char? Gender { get; set; }

    public string? BirthDate { get; set; }
}