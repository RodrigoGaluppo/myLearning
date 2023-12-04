namespace DAL.Controllers.Request;

public class CustomerRequest {

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public char? Gender { get; set; }

    public string? BirthDate { get; set; }
}