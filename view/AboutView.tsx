import { View } from '@/components/ui/view';
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import {StyleSheet} from 'react-native';

export default function AboutView() {
  return (
    <ScrollView style={styles.containerAbout}>
      <Text className="text-justify" style={{marginTop: 10}}>
        Produk dan ketentuan layanan telah mematuhi aturan pada website
        https://ppid.bps.go.id
      </Text>
      <Text size="2xl" className="font-bold my-[12px]">
        Privacy Policy
      </Text>
      <Text className="text-justify">
        Penggunaan Anda atas Aplikasi dan Layanan kami tunduk pada Ketentuan
        Penggunaan dan Kebijakan Privasi ini dan mengindikasikan persetujuan
        Anda terhadap Ketentuan Penggunaan dan Kebijakan Privasi tersebut.
      </Text>
      <Text size="2xl" className="text-justify font-bold my-[12px]">
        Definisi
      </Text>
      <View className="flex-column">
        <View className="flex-row flex-1">
          <Text className="mr-[6px]">1.</Text>
          <Text className="text-justify flex-1">
            Aplikasi = Aplikasi Si Leos Minut yang tersedia di google play
            store.
          </Text>
        </View>
        <View className="flex-row">
          <Text className="mr-[6px]">2.</Text>
          <Text className="text-justify flex-1">
            Informasi Pribadi = berarti data perseorangan/perusahaan
            tertentuyang melekat dan dapat diidentifikasi pada suatu
            individu/perusahaan dan yang dikumpulkan melalui Aplikasi, seperti
            nama, alamat, nomor identitas (apabila Anda adalah seorang
            individu), data dan dokumen identitas perusahaan (apabila Anda bukan
            seorang individu), nomor telepon, alamat surat elektronik (e-mail),
            nomor rekening bank, perizinan dan/atau sejenisnya, dan informasi
            lain yang mungkin
          </Text>
        </View>
        <View className="flex-row">
          <Text className="mr-[6px]">3.</Text>
          <Text className="text-justify flex-1">
            Badan Pusat Statistik (BPS) Kabupaten Minahasa Utara = Lembaga
            Pemerintah Nonkementerian yang bertanggung jawab langsung kepada
            Presiden selaku pemilik Aplikasi Si Leos Minut
          </Text>
        </View>
        <View className="flex-row">
          <Text className="mr-[6px]">4.</Text>
          <Text className="text-justify flex-1">
            Ketentuan Penggunaan = syarat dan ketentuan atau prosedur standar
            operasi atau ketentuan lainnya sehubungan dengan masing-masing
            Aplikasi yang dikembangkan oleh BPS Kabupaten Minahasa Utara,
            sebagaimana dapat diubah atau ditambah dari waktu ke waktu.
          </Text>
        </View>
      </View>
      <Text size="2xl" className="text-justify font-bold my-[12px]">
        Pemberian Informasi Pribadi oleh Anda:
      </Text>
      <Text className="text-justify">
        Kami tidak meminta informasi pribadi apapun oleh Anda dari Aplikasi Si
        Leos Minut.
      </Text>
      <Text size="2xl" className="text-justify font-bold my-[12px]">
        Perubahan atas Kebijakan Privasi ini:
      </Text>
      <Text className="text-justify">
        BPS Kabupaten Minahasa Utara dapat mengubah Kebijakan Privasi ini untuk
        sejalan dengan perkembangan kebutuhan yang ada di satker atau
        dipersyaratkan oleh peraturan perundang-undangan dan instusi pemerintah
        terkait. BPS Kabupaten Minahasa Utara meminta Anda untuk meninjau
        Aplikasi secara reguler dan terus-menerus selama Anda menggunakan
        Aplikasi untuk mengetahui informasi terbaru tentang bagaimana ketentuan
        Kebijakan Privasi ini diberlakukan.
      </Text>
      <Text size="2xl" className="text-justify font-bold my-[12px]">
        Pengakuan dan Persetujuan:
      </Text>
      <Text className="text-justify">
        Dengan menggunakan Aplikasi, Anda mengakui bahwa Anda telah membaca dan
        memahami Kebijakan Privasi ini dan Ketentuan Penggunaan Aplikasi ini.
      </Text>
      <Text size="2xl" className="text-justify font-bold my-[12px]">
        Cara untuk menghubungi BPS Kabupaten Minahasa Utara:
      </Text>
      <Text className="text-justify pb-[30px]" style={{marginBottom: 10,}}>
        Jika Anda memiliki pertanyaan lebih lanjut tentang privasi dan keamanan
        informasi Anda maka silakan hubungi kami di email: bps7106@bps.go.id
      </Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  containerAbout: {
    marginHorizontal: 5,
    paddingTop: 5,
    // paddingBottom: 10,
    // marginBottom: 10,
  },
});
