package com.booking.application.service.korisnici;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.booking.application.model.avionskakompanija.AvionskaKompanija;
import com.booking.application.model.hotel.Hotel;
import com.booking.application.model.korisnici.AdminKompanije;
import com.booking.application.model.vozila.KompanijaVozila;
import com.booking.application.repository.korisnici.AdminKompanijeRepository;
import com.booking.application.service.avionskakompanija.AvionskaKompanijaService;
import com.booking.application.service.hotel.HotelService;
import com.booking.application.service.vozila.KompanijaVozilaService;

@Service
public class AdminKompanijeService {

	@Autowired
	private AdminKompanijeRepository adminKompanijeRepository;

	@Autowired
	private HotelService hotelService;
	
	@Autowired
	private AvionskaKompanijaService avionskaKompanijaService;
	
	@Autowired
	private KompanijaVozilaService kompanijaVozilaService;
	
	public List<AdminKompanije> vratiAdmineHotela(Long hotelId) {
		Hotel hotel = this.hotelService.vratiJedan(hotelId);
		return hotel.getAdmini();
	}

	public List<AdminKompanije> vratiAdmineAvionskeKompanije(Long avionskaKompanijaId) {
		AvionskaKompanija avionskaKompanija = this.avionskaKompanijaService.vratiJednu(avionskaKompanijaId);
		return avionskaKompanija.getAdmini();
	}
	
	public List<AdminKompanije> vratiAdmineKompanijeVozila(Long kompanijaVozilaId) {
		KompanijaVozila kompanijaVozila = this.kompanijaVozilaService.vratiJednu(kompanijaVozilaId);
		return kompanijaVozila.getAdmini();
	}
	
	public AdminKompanije vratiJednogAdmina(Long adminId) {
		Optional<AdminKompanije> admin = this.adminKompanijeRepository.findById(adminId);
		if(admin.isPresent()) {
			return admin.get();
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND);
		}
	}

	public AdminKompanije kreiraj(AdminKompanije adminKompanije, Long kompanijaId) {
		switch(adminKompanije.getTip()) {
		case ADMIN_AVIONSKE_KOMPANIJE:
			AvionskaKompanija avionskaKompanija = this.avionskaKompanijaService.vratiJednu(kompanijaId);
			adminKompanije.setAvionskaKompanija(avionskaKompanija);
			break;
		case ADMIN_HOTELA:
			Hotel hotel = this.hotelService.vratiJedan(kompanijaId);
			adminKompanije.setHotel(hotel);
			break;
		case ADMIN_KOMPANIJE_VOZILA:
			KompanijaVozila kompanijaVozila = this.kompanijaVozilaService.vratiJednu(kompanijaId);
			adminKompanije.setKompanijaVozila(kompanijaVozila);
			break;
		default:
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
		}
		AdminKompanije kreiraniAdmin = this.adminKompanijeRepository.save(adminKompanije);
		return kreiraniAdmin;
	}

	public AdminKompanije azuriraj(AdminKompanije adminKompanije) {
		AdminKompanije stariAdmin = this.vratiJednogAdmina(adminKompanije.getId());
		stariAdmin.prekopiraj(adminKompanije);
		this.adminKompanijeRepository.save(stariAdmin);
		return stariAdmin;
	}

	public void obrisi(Long adminId) {
		AdminKompanije admin = this.vratiJednogAdmina(adminId);
		this.adminKompanijeRepository.delete(admin);
	}
	
}
