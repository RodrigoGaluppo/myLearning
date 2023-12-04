namespace DAL.Controllers.Request;

public class CustomerPutRequest {

    public string? FirstName { get; set; }

    public string? LastName { get; set; }


    public string? Username { get; set; }

    public char? Gender { get; set; }

    public string? BirthDate { get; set; }
      
    public string? ImgUrl { get; set; }

    public bool? Active { get; set; }
}