const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getDoctors() {
  const url = `${BASE_URL}/api/practitioner/doctors-with-speciality`;

  const resp = await fetch(url);
  const data = await resp.json();

  if (!resp.ok) {
    throw new Error(data?.message || "Error obteniendo doctores");
  }

  const activeDoctors = data.filter((d) => d.active);
  
  return activeDoctors.map((d) => {
    const name = `${d.family} ${d.given}`;

    let photo = `/doctors/${d.id}.jpg`;

    photo = photo || "/doctors/default.jpg";

    return {
      id: d.id,
      name,
      specialty: d.specialty || "No especificada",
      tag: "Profesional de la salud",
      photo,
      slots: [],
    };
  });
}
